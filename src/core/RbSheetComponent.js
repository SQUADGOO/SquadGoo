import React, { forwardRef, memo, useState, useRef, useImperativeHandle } from "react"
import RBSheet from "react-native-raw-bottom-sheet"
import { colors } from "../theme"
import { BlurView } from "@react-native-community/blur"
import { StyleSheet, View } from "react-native"

const RbSheetComponent = forwardRef(({ children, height, bgColor, wrapperColor, containerStyle }, ref) => {
	const sheetRef = useRef(null)
	const [isSheetOpen, setIsSheetOpen] = useState(false)

	useImperativeHandle(ref, () => ({
		open: () => {
			setIsSheetOpen(true)
			sheetRef.current?.open()
		},
		close: () => {
			setIsSheetOpen(false)
			sheetRef.current?.close()
		}
	}))

	return (
  <>
			{isSheetOpen && (
				<BlurView
					style={StyleSheet.absoluteFill}
					blurType="light"
					blurAmount={2}
					reducedTransparencyFallbackColor="white"
				/>
			)}
			<RBSheet
				ref={sheetRef}
				closeOnDragDown={true}
				closeOnPressBack={true}
				closeOnPressMask={true}
				height={height}
				onClose={() => setIsSheetOpen(false)}
				customStyles={{
					wrapper: {
						backgroundColor: "transparent",
					},
					container: {
						backgroundColor: bgColor ?? colors.white,
						borderTopLeftRadius: 20,
						borderTopRightRadius: 20,
						...containerStyle,
					},
					draggableIcon: {
						backgroundColor: colors.white
					},
				}}
			>
				<View>
					{children}
				</View>
			</RBSheet>
		</>
	)
})

export default memo(RbSheetComponent)
