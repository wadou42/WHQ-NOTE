### 遍历目录下的所有文件
```python
from pathlib import Path

def list_file(dir_path):
	path = Path(dir_path)
	for file in path.rglob("*"):
		if file.is_file():
			print(file)
```


### 延迟初始化
比较灵活，使用哪一种模型、类、函数，甚至是包
```python
class Dog:
    def speak(self):
        return "Woof!"

class Cat:
    def speak(self):
        return "Meow!"

animal_factory = {
    "dog": lambda: Dog(),
    "cat": lambda: Cat()
}

animal = animal_factory["dog"]()
print(animal.speak())  # 输出: Woof!
```

```python
import module_a
import module_b

module_factory = {
    "a": lambda: module_a,
    "b": lambda: module_b
}

module = module_factory["a"]()
print(module.function())  # 调用 module_a 中的函数
```