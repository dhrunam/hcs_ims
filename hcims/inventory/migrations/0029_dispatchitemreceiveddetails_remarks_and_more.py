# Generated by Django 4.0.3 on 2022-06-23 08:39

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('inventory', '0028_remove_dispatchitemreceiveddetails_purchase_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='dispatchitemreceiveddetails',
            name='remarks',
            field=models.CharField(blank=True, max_length=256, null=True),
        ),
        migrations.AlterField(
            model_name='dispatchitemreceiveddetails',
            name='item_dispatch_list',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='inventory.purchasedetails'),
        ),
    ]