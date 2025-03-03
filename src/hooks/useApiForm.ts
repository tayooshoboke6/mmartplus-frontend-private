import { useState, FormEvent } from 'react';
import { AxiosError } from 'axios';
import { handleApiError } from '../utils/apiUtils';

interface UseApiFormOptions<T> {
  initialValues: T;
  onSubmit: (values: T) => Promise<any>;
  onSuccess?: (response: any) => void;
  validateForm?: (values: T) => Record<string, string> | null;
}

interface ApiFormState<T> {
  values: T;
  errors: Record<string, string>;
  apiError: string | null;
  isSubmitting: boolean;
  isSubmitted: boolean;
}

function useApiForm<T extends Record<string, any>>({
  initialValues,
  onSubmit,
  onSuccess,
  validateForm,
}: UseApiFormOptions<T>) {
  const [state, setState] = useState<ApiFormState<T>>({
    values: initialValues,
    errors: {},
    apiError: null,
    isSubmitting: false,
    isSubmitted: false,
  });

  const setFieldValue = (name: keyof T, value: any) => {
    setState((prev) => ({
      ...prev,
      values: {
        ...prev.values,
        [name]: value,
      },
      // Clear field error when value changes
      errors: {
        ...prev.errors,
        [name]: '',
      },
      // Clear API error when any field changes
      apiError: null,
    }));
  };

  const setFieldError = (name: keyof T, error: string) => {
    setState((prev) => ({
      ...prev,
      errors: {
        ...prev.errors,
        [name]: error,
      },
    }));
  };

  const setApiError = (error: string | null) => {
    setState((prev) => ({
      ...prev,
      apiError: error,
    }));
  };

  const resetForm = () => {
    setState({
      values: initialValues,
      errors: {},
      apiError: null,
      isSubmitting: false,
      isSubmitted: false,
    });
  };

  const handleSubmit = async (e?: FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    // Validate form if validation function is provided
    if (validateForm) {
      const validationErrors = validateForm(state.values);
      if (validationErrors) {
        setState((prev) => ({
          ...prev,
          errors: validationErrors,
        }));
        return;
      }
    }

    // Set submitting state
    setState((prev) => ({
      ...prev,
      isSubmitting: true,
      apiError: null,
    }));

    try {
      // Call the submit function with current values
      const response = await onSubmit(state.values);

      // Update state with success
      setState((prev) => ({
        ...prev,
        isSubmitting: false,
        isSubmitted: true,
        apiError: null,
      }));

      // Call success callback if provided
      if (onSuccess) {
        onSuccess(response);
      }

      return response;
    } catch (error) {
      // Handle API error
      const errorMessage = handleApiError(error);

      // Check for validation errors in the response
      const apiErrors: Record<string, string> = {};
      if ((error as AxiosError<any>)?.response?.data?.errors) {
        const { errors } = (error as AxiosError<any>).response!.data;
        
        // Map Laravel validation errors to form fields
        Object.entries(errors).forEach(([key, messages]) => {
          if (Array.isArray(messages) && messages.length > 0) {
            apiErrors[key] = messages[0] as string;
          }
        });
      }

      // Update state with error
      setState((prev) => ({
        ...prev,
        isSubmitting: false,
        apiError: errorMessage,
        errors: {
          ...prev.errors,
          ...apiErrors,
        },
      }));

      throw error;
    }
  };

  return {
    values: state.values,
    errors: state.errors,
    apiError: state.apiError,
    isSubmitting: state.isSubmitting,
    isSubmitted: state.isSubmitted,
    setFieldValue,
    setFieldError,
    setApiError,
    handleSubmit,
    resetForm,
  };
}

export default useApiForm;
