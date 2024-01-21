import * as Yup from 'yup';

describe('NewTaskSchema Validation', () => {
  const NewTaskSchema = Yup.object().shape({
    priority: Yup.string().required('Priority is required'),
    priorityRequirement: Yup.string().required('Priority requirement is required'),
    isBigClient: Yup.string().required('Field is required'),
    clientEnvironment: Yup.string().required('Client environment name is required'),
    useCaseImpact: Yup.string().required('Field is required'),
    description: Yup.string().required('Description is required'),
    workDescription: Yup.string().required('Field is required'),
    requirement: Yup.string().required('Requirements is required'),
    // not required
    clientName: Yup.string(),
    clientRole: Yup.string(),
    reason: Yup.string(),
    goal: Yup.string(),
  });

  it('should pass validation with valid data', async () => {
    const validData = {
      priority: 'High',
      priorityRequirement: 'Some requirement',
      isBigClient: 'Yes',
      clientEnvironment: 'Test Environment',
      useCaseImpact: 'Positive',
      description: 'Test description',
      workDescription: 'Test work description',
      requirement: 'Test requirements',
    };

    await expect(NewTaskSchema.validate(validData)).resolves.not.toThrow();
  });

  it('should fail validation with invalid data', async () => {
    const invalidData = {
      // Missing required fields
    };

    await expect(NewTaskSchema.validate(invalidData)).rejects.toThrow(Yup.ValidationError);
  });


  // Example of testing a specific field
  it('should fail validation if priority is missing', async () => {
    const invalidData = {
      // Missing priority
    };

    let validationError;
    try {
      await NewTaskSchema.validate(invalidData, { abortEarly: false });
    } catch (error) {
      validationError = error;
    }

    expect(validationError).toBeDefined();
    expect(validationError.errors).toContain("Priority is required");
  });
});
