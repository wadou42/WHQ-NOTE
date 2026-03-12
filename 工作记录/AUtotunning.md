###  doris 环境配置
1. **配置系统参数**
```bash
# 设置系统最大打开文件句柄数
vim /etc/security/limits.conf

* soft nofile 204800
* hard nofile 204800
* soft nproc 204800
* hard nproc 204800

vim /etc/sysctl.conf
fs.file-max = 6553560

# 关闭交换分区
swapoff -a #临时有效、重启失效
# 想重新激活所有交换分区    swapon -a

# 修改虚拟内存至2000000
sudo sysctl -w vm.max_map_count=2000000
# 恢复默认值（通常为 65530）
sudo sysctl -w vm.max_map_count=65530
```
2. 