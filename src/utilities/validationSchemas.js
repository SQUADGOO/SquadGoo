import * as Yup from 'yup';

export const signinRules = {
  email: {
    required: 'Email is required',
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Please enter a valid email address',
    },
  },
  password: {
    required: 'Password is required',
  },
};

export const forgotRules = {
  email: {
    required: 'Email is required',
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Please enter a valid email address',
    },
  },
};

export const resetRules = {
  password: {
    required: 'Password is required',
    minLength: {
      value: 8,
      message: 'Password must be at least 8 characters long',
    },
    validate: {
      notCommon: value =>
        value.toLowerCase() !== 'password' || 'Password is too common',
      hasCapital: value => /[A-Z]/.test(value) || 'Password must contain at least one uppercase letter',
      hasSpecialChar: value =>
        /[!@#$%^&*(),.?":{}|<>]/.test(value) || 'Password must contain at least one special character',
      notAllNumbers: value => !/^\d+$/.test(value) || 'Password cannot be all numbers',
    },
  },

  confirmPassword: watch => ({
    required: 'Please confirm your password',
    validate: value => value === watch('password') || 'Passwords do not match',
  }),
};

export const editProfileValidationSchema = Yup.object().shape({
  first_name: Yup.string().required('First name is required'),
  last_name: Yup.string().required('Last name is required'),
  email: Yup.string().email('Please enter a valid email address'),
  mobile_number: Yup.string(),
  username: Yup.string(),
  address: Yup.object().shape({
    city: Yup.string(),
    state: Yup.string(),
    address: Yup.string(),
    zipCode: Yup.string(),
  }),
});

export const jobFormValidationSchema = Yup.object().shape({
  jobTitle: Yup.string().required('Job title is required'),

  noOfPositions: Yup.number()
    .typeError('Number of positions must be a number')
    .positive('Must be a positive number')
    .integer('Must be an integer')
    .required('Number of positions is required'),

  type: Yup.object()
    .shape({
      label: Yup.string().required(),
      value: Yup.string().required(),
    })
    .required('Work type is required'),

  jobType: Yup.object()
    .shape({
      label: Yup.string().required(),
      value: Yup.string().required(),
    })
    .required('Job type is required'),

  experience: Yup.string().required('Experience is required'),

  salary: Yup.number()
    .typeError('Salary must be a number')
    .positive('Must be a positive number')
    .required('Salary is required'),

  description: Yup.string().required('Description is required'),

  dob: Yup.date()
    .typeError('Closing date is required')
    .required('Closing date is required'),
});

export const changePasswordValidationSchema = Yup.object().shape({
  currentPassword: Yup.string().required('Current password is required'),

  newPassword: Yup.string()
    .min(8, 'New password must be at least 8 characters')
    .matches(/[A-Z]/, 'New password must contain at least one uppercase letter')
    .matches(/[a-z]/, 'New password must contain at least one lowercase letter')
    .matches(/\d/, 'New password must contain at least one number')
    .matches(/[@$!%*?&]/, 'New password must contain at least one special character')
    .required('New password is required'),

  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
    .required('Please confirm your password'),
});

export const employeeFormValidationSchema = Yup.object().shape({
  employeeId: Yup.string(),

  userName: Yup.string().required('Username is required'),

  employee_type: Yup.object()
    .shape({
      label: Yup.string().required('Employee type is required'),
      value: Yup.string().required('Employee type is required'),
    })
    .nullable()
    .required('Employee type is required'),

  role: Yup.object()
    .shape({
      label: Yup.string().required('Role label is required'),
      value: Yup.string().required('Role value is required'),
    })
    .nullable()
    .required('Role is required'),

  working_days: Yup.array()
    .of(
      Yup.object().shape({
        label: Yup.string().required('Day label is required'),
        value: Yup.string().required('Day value is required'),
      }),
    )
    .min(1, 'At least one working day is required')
    .required('Working days are required'),

  designation: Yup.string().required('Designation is required'),

  department: Yup.object()
    .shape({
      label: Yup.string().required(),
      value: Yup.string().required(),
    })
    .required('Department is required'),

  joining_date: Yup.date()
    .typeError('Joining date is required')
    .required('Joining date is required'),
});

export const employeePersonalFormValidationSchema = Yup.object().shape({
  employeeImage: Yup.mixed().nullable(),

  firstName: Yup.string().required('First name is required'),

  lastName: Yup.string().required('Last name is required'),

  number: Yup.string().required('Phone number is required'),

  email: Yup.string().email('Invalid email address').required('Email is required'),

  dob: Yup.date()
    .typeError('Date of birth is required')
    .required('Date of birth is required')
    .max(new Date(), 'Date of birth cannot be in the future')
    .test('age', 'Must be at least 18 years old', function (value) {
      if (!value) return false;
      const today = new Date();
      let age = today.getFullYear() - value.getFullYear();
      const m = today.getMonth() - value.getMonth();

      if (m < 0 || (m === 0 && today.getDate() < value.getDate())) {
        age--;
      }

      return age >= 18;
    }),

  martialStatus: Yup.object()
    .shape({
      label: Yup.string().required(),
      value: Yup.string().required(),
    })
    .required('Marital status is required'),

  gender: Yup.object()
    .shape({
      label: Yup.string().required(),
      value: Yup.string().required(),
    })
    .required('Gender is required'),

  nationality: Yup.object()
    .shape({
      label: Yup.string().required(),
      value: Yup.string().required(),
    })
    .required('Nationality is required'),

  address: Yup.object().shape({
    city: Yup.string().required('City is required'),
    state: Yup.string().required('State is required'),
    address: Yup.string().required('Address is required'),
    zipCode: Yup.string().required('Zip code is required'),
  }),
});

export const candidateInfoSchema = Yup.object().shape({
  employeeImage: Yup.mixed().nullable(),

  firstName: Yup.string().required('First name is required'),

  lastName: Yup.string().required('Last name is required'),

  number: Yup.string().required('Phone number is required'),

  email: Yup.string().email('Invalid email address').required('Email is required'),

  position: Yup.string().required('Position is required'),

  dob: Yup.date()
    .typeError('Applied date is required')
    .required('Applied date is required'),
});

export const candidateProfessionalInfoSchema = Yup.object().shape({
  about: Yup.string().required('About section is required'),

  experience: Yup.array()
    .of(
      Yup.object().shape({
        Company: Yup.string().required('Company name is required'),
        jobTitle: Yup.string().required('Job title is required'),
        startDate: Yup.date().required('Start date is required'),
        endDate: Yup.date().required('End date is required'),
      }),
    )
    .min(1, 'At least one experience entry is required'),

  portfolio: Yup.array()
    .of(
      Yup.object().shape({
        label: Yup.string().required('Portfolio label is required'),
        url: Yup.string().required('Portfolio URL is required'),
      }),
    )
    .min(1, 'At least one portfolio entry is required'),
});

export const validateLocationForm = ({name, zipcode}) => {
  const errors = {};

  if (!name.trim()) {
    errors.name = 'Location name is required';
  }

  if (!zipcode.trim()) {
    errors.zipcode = 'Zip code is required';
  } else if (!/^\d{4,10}$/.test(zipcode.trim())) {
    errors.zipcode = 'Zip code must be 4-10 digits';
  }

  return errors;
};

export const projectSchema = Yup.object().shape({
  name: Yup.string().required('Project name is required'),
  description: Yup.string().nullable(),
  status: Yup.object().shape({
    label: Yup.string().required(),
    value: Yup.string().required('Status is required'),
  }),
  start_date: Yup.date().required('Start date is required'),
  end_date: Yup.date()
    .required('End date is required')
    .min(Yup.ref('start_date'), 'End date must be after start date'),
});

export const timeOffSchema = Yup.object().shape({
  date: Yup.date().required('Date is required'),
  note: Yup.string(),
  whole_day: Yup.boolean(),
  start_time: Yup.string().when('whole_day', {
    is: false,
    then: schema => schema.required('Start time is required'),
    otherwise: schema => schema.notRequired(),
  }),
  end_time: Yup.string().when('whole_day', {
    is: false,
    then: schema => schema.required('End time is required'),
    otherwise: schema => schema.notRequired(),
  }),
});

export const taskSchema = Yup.object().shape({
  taskname: Yup.string().required('Task name is required'),
  description: Yup.string().required('Description is required'),
  status: Yup.object({
    label: Yup.string().required('Status is required'),
    value: Yup.string().required('Status is required'),
  }),
  tags: Yup.array()
    .of(
      Yup.object().shape({
        name: Yup.string().required('Tag name is required'),
        text_color: Yup.string().required('Text color is required'),
        background_color: Yup.string().required('Background color is required'),
      }),
    )
    .min(1, 'Please add at least one tag')
    .required('Tags are required'),
  selectedUsers: Yup.array()
    .of(
      Yup.object().shape({
        id: Yup.number().required('Invalid employee ID'),
        name: Yup.string().required('Employee is required'),
      }),
    )
    .min(1, 'Please select at least one employee')
    .required('Please select at least one employee'),
});

export const teamSchema = Yup.object().shape({
  selectedUsers: Yup.array()
    .of(
      Yup.object().shape({
        id: Yup.number().required('Invalid employee ID'),
        name: Yup.string().required('Employees are required'),
      }),
    )
    .min(1, 'Please select at least one employee')
    .required('Please select at least one employee'),
});

export const shiftSchema = Yup.object().shape({
  clockIn: Yup.date().required('Clock In time is required'),
  clockOut: Yup.date()
    .required('Clock Out time is required')
    .test(
      'is-greater',
      'Clock Out time must be after Clock In time',
      function (value) {
        const {clockIn} = this.parent;

        return value && clockIn ? new Date(value) > new Date(clockIn) : true;
      },
    ),
  note: Yup.string(),
});

export const appointmentSchema = Yup.object().shape({
  tag: Yup.object({
    name: Yup.string().trim().required('Tag title is required'),
    color: Yup.string().required('Color is required'),
  }).required('Tag is required'),

  selectedUsers: Yup.array()
    .of(
      Yup.object().shape({
        id: Yup.number().required('Invalid employee ID'),
        name: Yup.string().required('Employee is required'),
      }),
    )
    .min(1, 'Please select at least one employee')
    .required('Please select at least one employee'),

  time: Yup.string().required('Start time is required'),

  end_time: Yup.string().required('End time is required'),

  notes: Yup.string().nullable().max(500, 'Notes cannot exceed 500 characters'),
});

export const payrollSchema = Yup.object().shape({
  selectedUsers: Yup.array()
    .of(
      Yup.object().shape({
        id: Yup.number().required('Invalid employee ID'),
        name: Yup.string().required('Employee is required'),
      }),
    )
    .min(1, 'Please select at least one employee')
    .required('Please select at least one employee'),

  salary: Yup.string()
    .required('Monthly salary is required')
    .test(
      'is-decimal',
      'Salary must be a valid number',
      value => !isNaN(value) && Number(value) > 0,
    ),

  deduction: Yup.string()
    .notRequired()
    .test('is-decimal', 'Deduction must be a valid number', value => {
      if (!value) return true;

      return !isNaN(value) && Number(value) >= 0;
    })
    .test(
      'deduction-not-greater-than-salary',
      'Deduction cannot be greater than salary',
      function (value) {
        if (!value) return true;
        const salary = Number(this.parent.salary);
        const deduction = Number(value);

        return isNaN(salary) || isNaN(deduction) ? true : deduction <= salary;
      },
    ),

  payoutDate: Yup.date().required('Payout date is required'),

  note: Yup.string().required('Note is required'),

  status: Yup.object()
    .shape({
      label: Yup.string().required('Status is required'),
      value: Yup.string().required('Status is required'),
    })
    .required('Status is required'),
});

export const scheduleSchema = Yup.object().shape({
  selectedUsers: Yup.array()
    .of(
      Yup.object().shape({
        id: Yup.number().required('Invalid employee ID'),
        name: Yup.string().required('Employee is required'),
      }),
    )
    .min(1, 'Please select at least one employee')
    .required('Please select at least one employee'),

  clockIn: Yup.date().required('Clock in time is required'),

  clockOut: Yup.date()
    .required('Clock out time is required')
    .test('is-greater', 'Clock out time must be after clock in time', function (value) {
      const {clockIn} = this.parent;

      return value && clockIn ? new Date(value) > new Date(clockIn) : true;
    }),

  note: Yup.string(),
});