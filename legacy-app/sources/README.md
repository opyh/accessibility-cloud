# Source descriptions

This folder contains json files that describe certain data sources. A single source describes either a URL or a static file from the data folder. If the source 
file name starts with _ it is ignored, as well as any other non-json files in that directory.
The folder name for data files is in the settings.json file. The name of a source is determined from the file-name, but without any path and .json ending.
_The json sources itself allow C-style comments with // ... and /* .. */_

### Character sets
All sources will be converted to UTF-8 first before processed. An automated ICU detection will be run to determine the charset. If you do not want that, specify the 
encoding. For a list of possible choices see http://demo.icu-project.org/icu-bin/convexp?s=MIME&s=ALL

```
parameters: {                        
    charset     : 'ISO559whatever'    
    ...
```

## Example

A source json could look like this:
```
{
link        : "WCANLAGEODG.csv",      // ... for a static file in the data directory or URL for online ref    
converter   : "csv",                  // the converter to call
parameters: {                         // parameters specific to converter (see converter readme)
    auto_parse  : true,
    columns     : true,
    charset     : 'utf8'    
},
mappings: {                           // see chapter Mappings
    Id          : "row['FID']",
    Name        : "'Vienna public WC'",
    Address     : "row['STRASSE'] + ', Bezirk ' + row['BEZIRK'] + ', Vienna, Austria",
    Latitude    : "Number(row['POINT'].slice(8+row['POINT'].slice(7).indexOf(' ')).replace(')',''))",  // row['POINT'] is like "POINT (16.34374215516552 48.213577175258955)"
    Longitude   : "Number(row['POINT'].slice(7,7+row['POINT'].slice(7).indexOf(' ')))",
    Accessible  : "row['KATEGORIE'].includes('Behindertengerecht')",
},
properties: {                        // Properties specific to the whole set (to be defined)
    language    : "German",
    license     : "CC",
    publisher   : "Stadt Wien",
    coverage    : "Wien, Österreich",
    country     : "au"
}
}
```

An additional refresh parameter tells the manager to download / convert the source again after X hours. Default is 0, off. 

## Templating
A template property in the root of the object can be used to refer to other sources as a baseline. The properties of the other source (and their eventual template) 
will be the baseline and evry property present in the current source will be added or overwritten. Example:
```
{
    link: "...",
    template: "vienna",     // Will load vienna.json from source directory 
    ...
}
```

## Mappings
Every converter provides a facility to map the contents of a specific format to the desired internal representation. 
The mapping is scripted with JS and each present mapping is called per data-set or row. **Imagine the string for a mapping is what succeeds a return statement!** 
All mappings except "Accessible" are optional. All original data are per default appended to the final data-set so no data is lost. 

The following (optional) nomeclature exists and should be mapped if present:
```
Name        (string) The name of the place
Address     (string) Street, number, zip, state, city
Longitude   (number) in degrees -180 to 180
Latitude    (number) in degrees -90 to 90
Id          (string) A unique identifier that identifies this data-set. 
                     Could be "md5(this.Address)" or "row['vendor-id']" or "md5(row['vendor-id'])" 
                     If not present, the final JSON string of this object is hashed, 
                     which is not recommended as stringify does not guarantee order!
```
*The only non-optional mapping that must be present (the information we truly want from each entry):*
```
Accessible  (boolean) Wheelchair accessible
```
