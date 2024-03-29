export const validationErrors = {
  fieldIsRequired(field: string) {
    return `The field "${field}" is required.`;
  },
  shortLength(field: string, length: number) {
    return `The "${field}" field must be at least of ${length} length.`;
  },
  DOBError:
    'Date of birth must not be in the future and age must be at least 16 years',
  semesterNotInRange: 'Semester must be between 1 and 8',
};
