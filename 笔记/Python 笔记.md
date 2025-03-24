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

### random
**如果需要复现结果，需要设置随机数种子**
```python
# 生成随机的浮点数[0,1)之间的
random_float = random.random()
random_float = random.uniform(1.5,2.5) # 生成[a,b]之间的浮点数

#生成随机整数
random_int = random.randint(a,b)  #[a,b]之间的整数
random_int = random.randrange(a,b,c)  #[a,b] 之前步长为c的整数
print(random.randrange(0, 100, 5))  # 输出: 45

# 随机选择
random_int = random.choice([1,2,3])  #这里的数组也可以是字符串数组，都可以
random_list_int = random.choices([1,2,3,4], k=5)  # [4,3,3,4,1]

# 随机打乱
lst = [1,2,3,4]
random.shuffle(lst)
```

