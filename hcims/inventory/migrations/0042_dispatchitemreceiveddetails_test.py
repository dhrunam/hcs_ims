# Generated by Django 4.0.3 on 2022-07-08 10:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('inventory', '0041_itemallocation_item_received_details_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='dispatchitemreceiveddetails',
            name='test',
            field=models.CharField(blank=True, max_length=10),
        ),
    ]