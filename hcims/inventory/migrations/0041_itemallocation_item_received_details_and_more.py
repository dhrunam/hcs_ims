# Generated by Django 4.0.3 on 2022-07-08 10:00

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('configuration', '0014_vendor_bank_account_no_vendor_description_and_more'),
        ('inventory', '0040_remove_dispatchitemreceiveddetails_brand_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='itemallocation',
            name='item_received_details',
            field=models.ForeignKey(default='', on_delete=django.db.models.deletion.CASCADE, to='inventory.dispatchitemreceiveddetails'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='itemallocation',
            name='item',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='allocated_item', to='configuration.item'),
        ),
    ]
