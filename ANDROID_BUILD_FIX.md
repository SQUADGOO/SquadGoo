# Android Build Fix — RN 0.76 Compatibility & NDK

Date: 2026-05-06
Outcome: `yarn android` succeeds; APK installs on emulator.

## Errors observed

Running `yarn android` on a fresh checkout failed with three distinct issues, surfaced one at a time as each was fixed.

### 1. `react-native-gesture-handler:compileDebugKotlin` — Kotlin compile error
```
RNGestureHandlerButtonViewManager.kt:156
  Class 'ButtonViewGroup' is not abstract and does not implement abstract member
  public abstract fun getPointerEvents(): PointerEvents! defined in
  com.facebook.react.uimanager.ReactPointerEventsView
RNGestureHandlerButtonViewManager.kt:217
  'pointerEvents' overrides nothing
```

**Cause:** `package.json` had `"react-native-gesture-handler": "^2.28.0"`, so yarn pulled `2.31.2`. Versions ≥ 2.27 use `override var pointerEvents: PointerEvents` (Kotlin property), which requires the interface to declare both getter and setter. RN 0.76's `ReactPointerEventsView.java` only declares `PointerEvents getPointerEvents()` — no setter — so the Kotlin override fails to compile.

### 2. `react-native-reanimated:configureCMakeDebug[arm64-v8a]` — Prefab/CMake mismatch
```
[CXX1214] User has minSdkVersion 22 but library was built for 24 [//ReactAndroid/hermestooling]
```
Despite `android/build.gradle` correctly declaring `minSdkVersion = 24`, AGP was passing `-DANDROID_PLATFORM=android-22` to reanimated's CMake configure.

**Cause:** the configured NDK `26.1.10909125` was a partial/broken install on this machine — the directory contained only `source.properties` and no `platforms/`, `toolchains/`, etc. AGP fell back to NDK `26.0.10792818` for actual compilation but produced an inconsistent `abiPlatformVersion: 22` in the CMake command line, which then failed Prefab's compatibility check against RN 0.76's hermestooling library (built for android-24).

### 3. `react-native-svg` — C++ compile error
```
RNSVGLayoutableShadowNode.cpp:31:52
  no member named 'StyleSizeLength' in namespace 'facebook::yoga'; did you mean 'StyleLength'?
```

**Cause:** `package.json` had `"react-native-svg": "^15.12.0"`, so yarn pulled `15.15.4`. Newer svg uses `yoga::StyleSizeLength`, which only exists in Yoga shipped with RN 0.78+. RN 0.76's Yoga has `StyleLength`.

## Fixes applied

| # | File | Change | Why |
|---|------|--------|-----|
| 1 | `package.json` | `"react-native-gesture-handler": "^2.28.0"` → `"2.21.2"` | Last gesture-handler version compatible with RN 0.76's `ReactPointerEventsView` interface. |
| 2 | `package.json` | `"react-native-svg": "^15.12.0"` → `"15.8.0"` | Last svg version that uses RN 0.76's Yoga API (`StyleLength`). |
| 3 | `android/build.gradle` | `ndkVersion = "26.1.10909125"` → `"26.0.10792818"` | 26.1 install on this machine is incomplete; 26.0 is fully installed and is sufficient for RN 0.76's New Architecture. |

Both package.json changes drop the `^` so yarn cannot drift forward again.

## Recovery procedure (if the same errors return)

From `SquadGoo/`:

```powershell
# 1. clean gradle output
cd android
./gradlew clean
cd ..

# 2. wipe stale CMake caches that pin minSdkVersion / NDK from a previous configure
Remove-Item -Recurse -Force `
  node_modules\react-native-reanimated\android\.cxx, `
  node_modules\react-native-reanimated\android\build, `
  node_modules\react-native-gesture-handler\android\.cxx, `
  node_modules\react-native-gesture-handler\android\build, `
  android\app\.cxx, android\app\build, android\build `
  -ErrorAction SilentlyContinue

# 3. fresh dependency install (only needed if package.json changed)
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item -Force yarn.lock -ErrorAction SilentlyContinue
yarn install

# 4. build & install
yarn android
```

First build after a full clean takes ~25 min (every native module recompiles). Subsequent builds are incremental and much faster.

## Underlying cause — version drift via `^` ranges

All three regressions trace back to npm semver caret ranges in `package.json` letting yarn install versions published *after* RN 0.76 was released, when those library authors had already moved on to RN 0.77+/0.78+ APIs.

Two ways to keep this from recurring:

- **Pin native-module deps exactly** (drop `^`) for any package that ships native code. JS-only libraries are safer with caret ranges.
- **Or upgrade React Native** to 0.78+ (requires its own migration audit, but unlocks the latest gesture-handler/svg/reanimated).

## NDK note (optional cleanup)

The broken `C:\Users\Z Book\AppData\Local\Android\Sdk\ndk\26.1.10909125\` directory should be reinstalled or deleted via Android Studio → SDK Manager → SDK Tools. It currently produces a `[CXX5101] NDK folder ... does not contain 'platforms'` warning on every build, even though the build now uses 26.0.
