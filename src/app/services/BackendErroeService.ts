export function extractBackendError(err: any): string {
  const defaultMessage = 'An unexpected error occurred. Please try again.';
  const findStringDeep = (obj: any): string | null => {
      if (!obj || typeof obj !== 'object') return null;

      for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'string' && value.trim().length > 0) {
          // Return the first meaningful string
          return value.trim();
        }

        if (typeof value === 'object') {
          const nested = findStringDeep(value);
          if (nested) return nested;
        }
      }

      return null;
    };

  try {
    //  CASE 1: Validation errors (ASP.NET ModelState)
    if (err?.error?.errors && typeof err.error.errors === 'object' && !Array.isArray(err.error.errors)) {
      const allErrors = Object.values(err.error.errors)
        .flat()
        .filter((e: unknown): e is string => typeof e === 'string');
        console.log("errors 0 is called")
      if (allErrors.length > 0) return allErrors.join(', ');
    }

    //  CASE 2: ASP.NET ProblemDetails format
    if (err?.error?.title || err?.error?.detail) {
      const title = err.error.title || '';
      const detail = err.error.detail || '';
      const combined = [title, detail].filter(Boolean).join(' - ');
      console.log("errors 1 is called")
      if (combined) return combined;
    }

    //  CASE 3: err.error.errors is an array of strings
    if (Array.isArray(err?.error?.errors)) {
      const arr = err.error.errors.filter((e: unknown): e is string => typeof e === 'string');
      console.log("errors 2 is called", arr)
      if (arr.length > 0) return arr.join(', ');
    }

    if (Array.isArray(err?.error?.errors)) {
  const arr = err.error.errors
    .map((e: any) => {
      if (typeof e === 'string') return e; // direct string
      if (typeof e === 'object' && e !== null) {
        // join all key/value pairs in the object
        return Object.values(e)
          .filter((v): v is string => typeof v === 'string')
          .join(' ');
      }
      return null;
    })
    .filter((x:string): x is string => typeof x === 'string' && x.trim().length > 0);

  console.log('errors 2.1 is called', arr);
  if (arr.length > 0) return arr.join(', ');
}


    //  CASE 4: err.error itself is an array (e.g. BadRequest(["..."]))
    if (Array.isArray(err?.error)) {
      const arr = err.error.filter((e: unknown): e is string => typeof e === 'string');
      console.log("errors 3 is called")
      if (arr.length > 0) return arr.join(', ');
    }

    //  CASE 5: err.error.message
    if (typeof err?.error?.message === 'string'){
      console.log("errors 4 is called", err.error.message)
       return err.error.message;
    }

    //  CASE 6: nested error.error.message
    if (typeof err?.error?.error?.message === 'string'){
      console.log("errors 5 is called")

    return err.error.error.message;
    }

    //  CASE 7: err.error is a string (HTML or plain text)
    console.log(err.error);
    if (typeof err?.error === 'string') {
      const cleaned = err.error.replace(/<[^>]*>?/gm, '').trim();
      console.log("errors 6 is called")
      if (cleaned) return cleaned;
    }

    if (err?.error && typeof err.error === 'object') {
      const found = findStringDeep(err.error);
      console.log("errors 6 (deep search) is called", found);
      if (found) return found;
    }

    //  CASE 8: top-level err.message
    if (typeof err?.message === 'string') {
      console.log("errors 7 is called")
      return err.message;}

    //  CASE 9: fallback by status code
    if (err?.status === 400) return 'Bad request. Please check your input.';
    if (err?.status === 401) return 'You are not authorized to perform this action.';
    if (err?.status === 403) return 'Access forbidden.';
    if (err?.status === 404) return 'Resource not found.';
    if (err?.status >= 500) return 'Server error. Please try again later.';
  } catch (error) {
    console.warn('Error parsing backend error:', error);
    return defaultMessage;
  }

  return defaultMessage;
}
