# Generated by Django 4.0.3 on 2022-05-26 10:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('configuration', '0006_alter_district_state_alter_division_office_id_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='FinancialYear',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('financial_year', models.CharField(max_length=7)),
            ],
        ),
    ]
