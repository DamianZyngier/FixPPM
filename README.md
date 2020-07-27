# FixPPM

FixPPM is a script that improves quality of work with HP Project and Portfolio Management by making it more readable and adds some QoL features. It is working only for raporting timesheets.
It has been designed to work with Tampermonkey addon, but can be also used with other addons when modified.

## Features

On page startup:

* clears values from all inputs that are equal to 0,00.
* colors the Saturday and Sunday columns.

Additionally, script introduces two buttons and a checkbox.

### Button "Clear all 0,00"

Clears 0,00 values from all inputs if any reappeared.

### Button "Validate"

Validates input and result fields if:

* value is not dividable by 0,5 (paints table cell in orange)
* value is higher than 8 (paints table cell in orange)
* value is exactly 8 (paints table cell in light green)

### Checkbox "Auto clear & validate"

Automatically applies changes performed by buttons "Clear all 0,00" and "Validate".
Value (if the box is checked or not) is saved between browser card closures, but may be forgotten after browser is closed.
Calculates total days and adds it under "Total" column.

## Setup instruction

1. Download and install [tampermonkey](http://www.tampermonkey.net) addon for your preferred browser.
1. Left click on addon icon, and select "Add new script".
1. Copy [fixppm](fixppm.js) script from GitHub & paste it to Tampermonkey new script editor. Save it (either file & save or ctrl+s).

## Modifications

Script can be modified to use different colors, or work with part time employees by changing the appropriate values. They have been put in the beginning.

## Feedback

Feedback can be provided to author Damian Zyngier by creating new issue in GitHub, or contacting Damian directly using your favorite communicator.