import * as z from 'zod';

export const profileSchema = z.object({
    first_name: z.string().min(1, 'First name is required'),
    last_name: z.string().min(1, 'Last name is required'),
    email: z.string().min(1, 'Email is required').email('Invalid email format'),
});

export const validateProfile = (data) => {
    try {
        const validatedData = profileSchema.parse(data);
        return { success: true, data: validatedData };
    } catch (error) {
        if (error instanceof z.ZodError) {
            const errors = {};
            error.errors.forEach((err) => {
                errors[err.path[0]] = err.message;
            });
            return { success: false, errors };
        }
        return { success: false, errors: { general: 'Validation failed' } };
    }
};