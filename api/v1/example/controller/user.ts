import { z } from 'zod';
import { validateLoginSchema } from '../helpers/schemas';
import { ApiError, ApiResponse, compareHashedPassword } from '../../../../helpers';

const user = {
  email: "example@example.com",
  password: "$2a$12$xmU1v4tWlSpAKFUqDhQOV.5yhQWNLNsjohhVjvy9iay6qOH/GOU/y"
}

export async function exampleController(
  body: z.infer<typeof validateLoginSchema>
) {
  // manange errors
  if (body.password.length <= 6) {
    throw new ApiError({ statusCode: 400, message: 'Invalid password', title: "Warning" });
  }
  var authenticated = false;
  if (body.email == user.email && await compareHashedPassword(body.password, user.password)) {
    authenticated = true;
  }else{
    throw new ApiError({ statusCode: 401, message: 'Unauthorized', title: "Error" });
  }


  return new ApiResponse({
    statusCode: 200,
    message: 'Success',
    success: true,
    data: { authenticated, email: body.email, username: "example", rol: "admin" },
    title: "Success"
  });
}
