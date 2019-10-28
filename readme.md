# cz-emoji

> Commitizen adapter formatting commit messages using emojis.


**cz-emoji-kl** allows you to easily use emojis in your commits using [commitizen].

```sh
? 请选择你本次提交的类型: (Use arrow keys)
❯ feat      ✨  新功能（feature）
  fix       🐛  修补bug
  style     🎨  格式（不影响代码运行的变动）
  refactor  🔨  重构（即不是新增功能，也不是修改bug的代码变动）
  chore     🔥  构建过程或辅助工具的变动
  lint      🚨  lint规范格式化
  revert    ⏪  Reverting changes.
```

## Install

```bash
npm install -g commitizen

# install cz-emoji-kl locally
commitizen init cz-emoji-kl --save-dev
```

## Usage

```sh
$ git cz
```

## Customize

By default `cz-emoji-xg` comes preconfigured with the [Gitemoji](https://gitmoji.carloscuesta.me/) types.

But you can customize things on a project basis by adding a configuration section in your `package.json`:

```json
{
  "config": {
    "cz-emoji-kl": {}
  }
}
```


## Examples

 - https://github.com/Falieson/TRAM


[commitizen]: https://github.com/commitizen/cz-cli
[Inquirer.js]: https://github.com/SBoudrias/Inquirer.js/
