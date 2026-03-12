| 转换路径                           | 关键方法                                          | 内存共享/复制 | 说明                                         |
| ------------------------------ | --------------------------------------------- | ------- | ------------------------------------------ |
| Tensor $\leftrightarrow$ NumPy | `tensor.numpy()`<br>`torch.from_numpy(array)` | 共享      | 快速高效，修改一方会影响另一方 (GPU Tensor 必须先 `.cpu()`)。 |
| Tensor $\rightarrow$ List      | `tensor.tolist()`                             | 复制      | 深拷贝，将数据转换为标准 Python `list`，必须在 CPU 上执行。    |
| NumPy $\rightarrow$ List       | `array.tolist()`                              | 复制      | 深拷贝，将数据转换为标准 Python `list`。                |
| List $\rightarrow$ Tensor      | `torch.tensor(list)`                          | 复制      | 根据列表内容创建新的 Tensor。                         |
| List $\rightarrow$ NumPy       | `numpy.array(list)`                           | 复制      | 根据列表内容创建新的 NumPy 数组。                       |

