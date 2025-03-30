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

### tqdm 生成进度条



### tensor数据类型转化


### matplotlib绘图
0.**乱码问题**
这个字体可能没有，可以在~/.cache/matplotlib/\*.json中查看其他字体，也可以去下载
```python 
plt.rcParams['font.sans-serif'] = ['SimHei']  # 用来正常显示中文标签
plt.rcParams['axes.unicode_minus'] = False  # 解决负号'-'显示为方块的问题
```
1.**基础用法**：
```python
import matplotlib.pyplot as plt

X = [1,2,3,4]
Y = [1,4,9,16]

plt.plot(X, Y)
plt.savefig()
```
2.**标记和颜色**
其中markerfacecolor是填充物的颜色，markeredgecolor是边缘的颜色
```python
plt.plot(X, Y, marker='o', markerfacecolor='red', markeredgecolor='black')
```
一些常见的标志
'.' 点标记
',' 像素标记
'o' 圆圈
'v' 下三角
'^' 上三角
'<' 左三角
'>' 右三角
'1' 类似三叉戟向下
'2' 类似三叉戟向上
'3' 左三叉戟
'4' 右三叉戟
's' 正方形
'p' 五边形
'\*' 星号
'h' 六边形侧边
'H' 六边形点
'+' 加号
'x' x标记
'D' 菱形
'd' 细菱形
'|' 水平线标记
'\_' 垂直线标记

3.**线性基础**
```python 
import matplotlib.pyplot as plt
import numpy as np

x = np.linspace(0, 10, 100)
plt.plot(x, np.sin(x), linestyle='-', label='实线') 
plt.plot(x, np.cos(x), linestyle='--', label='虚线')
plt.plot(x, np.tan(x), linestyle='-.', label='点划线') 
plt.plot(x, -np.sin(x), linestyle=':', label='点线')  

plt.legend()
plt.show()
```

4.