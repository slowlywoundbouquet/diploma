import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const user = ctx.switchToHttp().getRequest().user;

    if (!user) {
      return null;
    }
    if (data) {
      return user[data];
    }

    return user;
  },
);
