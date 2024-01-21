import * as Yup from 'yup';

describe('NewTaskSchema Validation', () => {
  const NewTaskSchema = Yup.object().shape({
    reportBy: Yup.string().required('Field is required'),
    dateReported: Yup.mixed().nullable().required('Date reported is required'),
    module: Yup.string().required('Field is required'),
    severity: Yup.string().required('Field is required'),
    severityEffect: Yup.string().required('Field is required'),
    priority: Yup.string().required('Priority is required'),
    stepToProduce: Yup.string().required('Field is required'),
    expectedResult: Yup.string().required('Field is required'),
    actualResult: Yup.string().required('Field is required'),
    // not required
    description: Yup.string(),
    preCondition: Yup.string(),
    additionalInformation: Yup.string(),
  });

  it('should pass validation with valid data', async () => {
    const validData = {
      reportBy: 'John Doe',
      dateReported: new Date(),
      module: 'Testing Module',
      severity: 'High',
      severityEffect: 'Critical',
      priority: 'Urgent',
      stepToProduce: 'Perform some steps',
      expectedResult: 'Expect the result',
      actualResult: 'Observe the actual result',
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
