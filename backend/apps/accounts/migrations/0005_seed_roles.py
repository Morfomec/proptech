from django.db import migrations


def seed_roles(apps, schema_editor):
    """Seed default system roles."""

    Role = apps.get_model("accounts", "Role")

    roles = [
        {
            "name": "TENANT",
            "description": "Can search and rent properties.",
        },
        {
            "name": "OWNER",
            "description": "Can create and manage properties.",
        },
        {
            "name": "BROKER",
            "description": "Can manage properties on behalf of property owners.",
        },
        {
            "name": "ADMIN",
            "description": "Has administrative access to the platform.",
        },
    ]

    for role in roles:
        Role.objects.get_or_create(
            name=role["name"],
            defaults={
                "description": role["description"],
            },
        )


def unseed_roles(apps, schema_editor):
    """Remove default system roles."""

    Role = apps.get_model("accounts", "Role")

    Role.objects.filter(
        name__in=[
            "TENANT",
            "OWNER",
            "BROKER",
            "ADMIN",
        ]
    ).delete()


class Migration(migrations.Migration):

    dependencies = [
        ("accounts", "0004_role_useraddress_userprofile_userrole"),
    ]

    operations = [
        migrations.RunPython(
            seed_roles,
            reverse_code=unseed_roles,
        ),
    ]