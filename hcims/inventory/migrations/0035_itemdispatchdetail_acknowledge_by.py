# Generated by Django 4.0.3 on 2022-07-05 05:32

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('inventory', '0034_itemdispatchdetail_acknowledge_on_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='itemdispatchdetail',
            name='acknowledge_by',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='acknowledge_by', to=settings.AUTH_USER_MODEL),
        ),
    ]