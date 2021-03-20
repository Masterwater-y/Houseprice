const req = require.context("./svg", false, /\.svg$/); //读取目录下所有文件 第一个：目录 第二个：是否遍历子级目录 第三个：定义遍历文件规则
const requireAll = requireContext => {
  return requireContext.keys().map(requireContext);
};
requireAll(req);
