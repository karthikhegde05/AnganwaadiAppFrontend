import { IonContent, IonSearchbar } from "@ionic/react";
import React, {useState} from "react";

const boysGrowthMap : Record<number, number> = {
    45:1.9,
    46:2.0,
    47:2.1,
    48:2.3,
    49:2.4,
    50:2.6,
    51:2.7,
    52:2.9,
    53:3.1,
    54:3.3,
    55:3.6,
    56:3.8,
    57:4.0,
    58:4.3,
    59:4.5,
    60:4.7,
    61:4.9,
    62:5.1,
    63:5.3,
    64:5.5,
    65:5.7,
    66:5.9,
    67:6.1,
    68:6.3,
    69:6.5,
    70:6.6,
    71:6.8,
    72:7.0,
    73:7.2,
    74:7.3,
    75:7.5,
    76:7.6,
    77:7.8,
    78:7.9,
    79:8.1,
    80:8.2,
    81:8.4,
    82:8.5,
    83:8.7,
    84:8.9,
    85:9.1,
    86:9.3,

    87:9.6,
    88:9.8,
    89:10.0,
    90:10.2,
    91:10.4,
    92:10.6,
    93:10.8,
    94:11.0,
    95:11.1,
    96:11.3,
    97:11.5,
    98:11.7,
    99:11.9,
    100:12.1,
    101:12.3,
    102:12.5,
    103:12.8,
    104:13.0,
    105:13.2,
    106:13.4,
    107:13.7,
    108:13.9,
    109:14.1,
    110:14.4,
    111:14.6,
    112:14.9,
    113:15.2,
    114:15.4,
    115:15.7,
    116:16.0,
    117:16.2,
    118:16.5,
    119:16.8,
    120:17.1
 }

 const girlsGrowthMap : Record<number, number> = {
    45:1.9,
    46:2.0,
    47:2.2,
    48:2.3,
    49:2.4,
    50:2.6,
    51:2.8,
    52:2.9,
    53:3.1,
    54:3.3,
    55:3.5,
    56:3.7,
    57:3.9,
    58:4.1,
    59:4.3,
    60:4.5,
    61:4.7,
    62:4.9,
    63:5.1,
    64:5.3,
    65:5.5,
    66:5.6,
    67:5.8,
    68:6.0,
    69:6.1,
    70:6.3,
    71:6.5,
    72:6.6,
    73:6.8,
    74:6.9,
    75:7.1,
    76:7.2,
    77:7.4,
    78:7.5,
    79:7.7,
    80:7.8,
    81:8.0,
    82:8.1,
    83:8.3,
    84:8.5,
    85:8.7,
    86:8.9,

    87:9.2,
    88:9.4,
    89:9.6,
    90:9.8,
    91:10.0,
    92:10.2,
    93:10.4,
    94:10.6,
    95:10.8,
    96:10.9,
    97:11.1,
    98:11.3,
    99:11.5,
    100:11.7,
    101:12.0,
    102:12.2,
    103:12.4,
    104:12.6,
    105:12.9,
    106:13.1,
    107:13.4,
    108:13.7,
    109:13.9,
    110:14.2,
    111:14.5,
    112:14.8,
    113:15.1,
    114:15.4,
    115:15.7,
    116:16.0,
    117:16.3,
    118:16.6,
    119:16.9,
    120:17.3
 }
 


export { boysGrowthMap };
export { girlsGrowthMap };