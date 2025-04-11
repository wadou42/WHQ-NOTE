### 向右键中添加markdown文件
1. 创建一个txt文件
```csharp
Windows Registry Editor Version 5.00
[HKEY_CLASSES_ROOT\.md]
@="MarkdownFile"
"PerceivedType"="text"
"Content Type"="text/plain"
[HKEY_CLASSES_ROOT\.md\ShellNew]
[HKEY_CLASSES_ROOT\MarkdownFile]
@="Markdown"
[HKEY_CLASSES_ROOT\MarkdownFile\DefaultIcon]
@="%SystemRoot%\system32\imageres.dll,-102"
[HKEY_CLASSES_ROOT\MarkdownFile\shell]
[HKEY_CLASSES_ROOT\MarkdownFile\shell\open]
```
2. 改名为.reg 文件，运行即可