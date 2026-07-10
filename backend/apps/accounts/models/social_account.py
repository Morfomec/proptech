from django.conf import settings
from django.db import models


class SocialAccount(models.Model):
    class Provider(models.TextChoices):
        Google="google", "Google"

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="social_accounts")
    provider = models.CharField(max_length=20, choices=Provider.choices)
    provider_user_id = models.CharField(max_length=255)
    email = models.EmailField()
    picture = models.URLField(blank=True)
    last_login = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "social_accounts"
        unique_together = (
            "provider",
            "provider_user_id",
        )

        indexes = [
            models.Index(fields=["provider"]),
            models.Index(fields=["email"]),
        ]


    def __str__(self):
        return f"{self.provider}: {self.email}"
    

    