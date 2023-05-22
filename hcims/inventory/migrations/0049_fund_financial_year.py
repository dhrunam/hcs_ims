# Generated by Django 4.0.3 on 2022-08-22 07:06

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('configuration', '0014_vendor_bank_account_no_vendor_description_and_more'),
        ('inventory', '0048_alter_itemdispatchdetail_acknowledge_on'),
    ]

    operations = [
        migrations.AddField(
            model_name='fund',
            name='financial_year',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='fy', to='configuration.financialyear'),
        ),
    ]
