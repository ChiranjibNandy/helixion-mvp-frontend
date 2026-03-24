export function parseApiError(err: any) {
    const res = err?.response?.data;
  
    if (!res) {
      return { message: 'Something went wrong' };
    }
  
    // Case 1: simple message
    if (res.message && !res.errors) {
      return { message: res.message };
    }
  
    // Case 2: validation error (nestjs / class-validator)
    if (res.errors?.properties) {
      const fieldErrors: Record<string, string> = {};
  
      const props = res.errors.properties;
  
      for (const key in props) {
        if (props[key]?.errors?.length) {
          fieldErrors[key] = props[key].errors[0];
        }
      }
  
      return {
        message: res.message,
        fieldErrors,
      };
    }
  
    return { message: res.message || 'Request failed' };
  }