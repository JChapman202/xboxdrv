# Node XBOXDRV

### Prerequisites:

 * Linux
 * xboxdrv
 * Xbox 360 Controller (Wired or USB RF Wireless)
### Description

node module which wraps the linux xboxdrv console application.  It uses the standard output from xboxdrv to determine the state of a single connected Xbox 360 controller. This module was created as a simpler workaround solution to the complexities of dealing with node-hid on a linux machine.

### How to use

```
var controller = require("xboxdrv");
``` 


