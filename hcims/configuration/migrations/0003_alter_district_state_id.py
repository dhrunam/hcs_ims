# Generated by Django 4.0.3 on 2022-05-18 07:12

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('configuration', '0002_district_state_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='district',
            name='state_id',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='state', to='configuration.state'),
        ),
    ]
