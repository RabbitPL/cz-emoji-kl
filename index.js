'use strict'

const readPkg = require('read-pkg-up')
const truncate = require('cli-truncate')
const wrap = require('wrap-ansi')
const pad = require('pad')
const fs = require('fs-extra');
const path = require('path');
var shell = require('shelljs');
const types = require('./lib/types')


function getEmojiChoices(types) {
    // 遍历types数组，获取name名称最长的长度
  const maxNameLength = types.reduce(
    (maxLength, type) => (type.name.length > maxLength ? type.name.length : maxLength
  ), 0);

  return types.map(choice => ({
    //pad函数实现name以最长的长度占位，多余为空
    name: `${pad(choice.name, maxNameLength)}  ${choice.emoji}  ${choice.description}`,
    value: choice.code
  }))
}
let appendsNames = [];
function createQuestions(res) {
    // res.packageJson配置返回读取的packjson.json配置信息
    const config = res.packageJson || {}
    // TODO: 这个暂时还不知道干啥，从哪读取
    const emojiConfig = config['cz-emoji-xg'] || {};
    const appends = emojiConfig.appends || [];
    appendsNames = appends.map(function (item) { return item.name;});
    // 拼接操作提示命令
    return [
        {
            type: 'list',
            name: 'type',
            message: "请选择你本次提交的类型:",
            choices: getEmojiChoices(emojiConfig.types || types)
        }].concat(appends, [
        {
            type: emojiConfig.scopes ? 'list' : 'input',
            name: 'scope',
            message: '说明本次提交影响范围 (pages or files ...):',
            choices: emojiConfig.scopes && [{ name: '[none]', value: '' }].concat(emojiConfig.scopes)
        },
        {
            type: 'input',
            name: 'taskType',
            message: '当前相关kep是任务(task)还是缺陷(bug),默认为task):',
        },
        {
            type: 'ones',
            name: 'kepId',
            message: '请输入当前相关任务号(默认可从当前分支获取):'
        },
        {
            type: 'input',
            name: 'subject',
            message: '请输入当前提交简介:'
        }
    ]);
}

function format(answers) {
    // parentheses are only needed when a scope is present
    const res = shell.exec('git symbolic-ref --short -q HEAD') || {};
    const branch = res.stdout || '';
    const regRes = /feature_[a-zA-Z]*([0-9]+)_/.exec(branch); // 兼容kep类型是bug
    const defaultTask = regRes && regRes[1] || ''; // 默认从分支获取任务
    const scope = answers.scope ? `(${answers.scope.trim()})` : ''
    const taskType = answers.taskType ? answers.taskType.trim() : 'task'
    const kepId = answers.kepId ? answers.kepId.trim() : defaultTask
    // 兼容普通工程，没有任务ID则不展示kep信息
    let kepIdCommit = kepId ? `kep#${taskType}-${kepId}` : ''; 
  
    // TODO: 这个appends又是啥
    let appends = '';
    if (appendsNames.length) {
      appendsNames.forEach((item) => {
        appends += `[${answers[item]}]`
      });
    }
  
    // build head line and limit it to 100
    let commit = truncate(answers.type + appends + scope + ': ' + kepIdCommit + answers.subject.trim(), 150)

    return (commit)
  }

module.exports = {
    prompter: function(cz, commit) {
        readPkg()
        .then(createQuestions)
        .then(cz.prompt)
        .then(format)
        .then(commit)
    }
}