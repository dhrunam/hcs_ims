# Generated by Django 4.0.3 on 2022-07-07 12:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('inventory', '0039_rename_purchase_item_itemdispatchlist_purchase_item_received'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='dispatchitemreceiveddetails',
            name='brand',
        ),
        migrations.RemoveField(
            model_name='dispatchitemreceiveddetails',
            name='model_no',
        ),
        migrations.RemoveField(
            model_name='dispatchitemreceiveddetails',
            name='specification',
        ),
        migrations.RemoveField(
            model_name='dispatchitemreceiveddetails',
            name='warranty_period',
        ),
        migrations.AddField(
            model_name='itemdispatchlist',
            name='brand',
            field=models.CharField(blank=True, max_length=64),
        ),
        migrations.AddField(
            model_name='itemdispatchlist',
            name='model_no',
            field=models.CharField(blank=True, max_length=128, null=True),
        ),
        migrations.AddField(
            model_name='itemdispatchlist',
            name='specification',
            field=models.CharField(blank=True, max_length=1024),
        ),
        migrations.AddField(
            model_name='itemdispatchlist',
            name='warranty_period',
            field=models.SmallIntegerField(default=0),
        ),
    ]