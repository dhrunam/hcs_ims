# Generated by Django 4.0.3 on 2022-07-04 06:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('inventory', '0031_itemdispatchdetail_purchase_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='purchasedetails',
            name='is_dispatchable',
            field=models.BooleanField(default=True),
        ),
    ]