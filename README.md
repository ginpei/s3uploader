# S3Uploader

Upload files contained in a zip file recursively.

## Setting up

Requires:

- AWS CLI
- `unzip`
- Settings

### AWS CLI

Make sure AWS CLI has been set. This uploader requires its profile.

- https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html

### `unzip`

Make sure `unzip` is installed.

```console
$ unzip       
UnZip 6.00 of 20 April 2009, by Debian. Original by Info-ZIP.               
                                                                            
Usage: unzip [-Z] [-opts[modifiers]] file[.zip] [list] [-x xlist] [-d exdir] 
  Default action is to extract files in list, except those in xlist, to exdir;
  file[.zip] may be a wildcard.  -Z => ZipInfo mode ("unzip -Z" for usage). 

…
```

If not installed, search on the internet "how to install unzip".

### Settings

Copy `upload-settings.example.json` to `upload-settings.json` and edit.

It requires 2 properties:

- `bucket` : The target S3 bucket name.
- `keyPrefix` : The key prefix (aka folder).

## Usage

1. Build

```console
$ npx tsc
```

2. Run

```console
$ node out/index.js <path-to-zip>
```

### Profile

If you need an AWS profile other than the default, set `AWS_PROFILE`.

```console
$ AWS_PROFILE=<profile-name> node out/index.js <path-to-zip>
```

## License

Not licensed.
