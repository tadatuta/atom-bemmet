# atom-bemmet package

Atom plugin for [bemmet](https://github.com/tadatuta/bemmet).

## How to use

To convert an abbreviation to BEMJSON press `shift-cmd-C`.

For example, this abbreviation

```
menu>__item*2>link_theme_islands
```

will be transformed into

```
{
    block: 'menu',
    content: [
        {
            block: 'menu',
            elem: 'item',
            content: {
                block: 'link',
                mods: {
                    theme: 'islands'
                },
                content: {}
            }
        },
        {
            block: 'menu',
            elem: 'item',
            content: {
                block: 'link',
                mods: {
                    theme: 'islands'
                },
                content: {}
            }
        }
    ]
}
```
