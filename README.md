# Human Readable Glossary Tool (HRGT)

## Overview

The **Human Readable Glossary Tool (HRGT)** generates a Human Readable Glossary (HRG) that consists of (a selection of) the terms that are part of the terminology of a specific scope. The HRGT takes one specific MRG as its input, and converts (a selection of) its MRG entries into one of the supported output formats, e.g. HTML, or PDF. The file that contains the MRG is named mrg.<scopetag>.<vsntag>.yaml, where the combination of <scopetag> and <vsntag> identify a particular terminology. See the MRG file naming conventions for details. There is more information about 
- [overview of the TEv2 tools](https://tno-terminology-design.github.io/tev2-specifications/docs/tev2-overview) of which the TRRT is a part.

## Installation

Install from the command line and make globally available.

```bash
npm install @aviarytech/hrgt -g
```

## Calling the Tool

The behavior of the HRGT can be configured per call e.g. by a configuration file and/or command-line parameters. The command-line syntax is as follows:

```bash
hrgt [ <paramlist> ] [ <globpattern> ]
```

The HRGT takes in the following parameters:

|Flags                         |Description                                                             |Required|
|------------------------------|------------------------------------------------------------------------|:------:|
|-c, --config \<path>          |Path (including the filename) of the tool's (YAML) configuration file   |No      |
|input \<globpattern>          |Glob pattern that specifies the set of (input) files                    |No      |
|-o, --output \<name>           |text that is used as the last part of the name of the file(s) that contain(s) the generated HRG(s).                         |No     |
|-s, --scopedir \<path>        |Path of the scope directory where the SAF is located                    |No     |
|-v, --vsntag \<vsntag>        |Default version to use when no version is set in term ref               |No      |
|-f, --force                   |Allow overwriting of existing files                                     |No      |
|-t, --termselcrit \<criteria> |List of term selection criteria that are used to generate               |No      |
|-m, --method \<method>        |The method that is used to create the output (default HTML)             |No      |
|-l, --license \<path>         |File that contains the licensing conditions                             |No      |

