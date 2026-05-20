import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RequestWithUser } from '../auth/interfaces/authenticated-user.interface';

@Injectable()
export class CatalogAdminGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const adminEmails = this.getAdminEmails();

    if (adminEmails.length === 0) {
      throw new ForbiddenException('Catalog admin emails are not configured');
    }

    if (!adminEmails.includes(request.user.email.toLowerCase())) {
      throw new ForbiddenException('Only catalog admins can perform this action');
    }

    return true;
  }

  private getAdminEmails(): string[] {
    const rawValue = this.configService.get<string>('CATALOG_ADMIN_EMAILS', '');

    return rawValue
      .split(',')
      .map((email) => email.trim().toLowerCase())
      .filter((email) => email.length > 0);
  }
}
