# 答辩交互网页 使用与部署说明

数据已全部匿名化（C1-C16），不含任何可识别个人身份的信息。

## 一、本地预览（先看效果）
双击 `index.html`，用浏览器打开即可。
若图表不显示，改用本地服务器预览（在文件夹里执行）：
```
python -m http.server 8000
```
然后浏览器访问 http://localhost:8000

## 二、部署到 GitHub Pages（拿到可扫码的网址）
1. 登录 GitHub，点右上角 + ，New repository。
2. 仓库名填 `tiaozhan-web`，可见性选 Public，创建。
3. 进入仓库，点 Add file，Upload files，把 `index.html`、`style.css`、`data.js`、`app.js` 四个文件上传，Commit。
4. 进入仓库 Settings，左侧选 Pages。
5. Source 选 Deploy from a branch，Branch 选 main，目录选 / (root)，点 Save。
6. 等 1 到 2 分钟，页面顶部会出现网址：
   `https://你的用户名.github.io/tiaozhan-web/`
7. 用手机浏览器打开该网址，确认能正常显示图表。

## 三、生成二维码（答辩现场用）
把上一步的网址复制到任一在线二维码工具（如草料二维码 cli.im），生成二维码图片，
放进答辩 PPT，或打印出来给评委扫码。

## 四、修改内容
- 数据：改 `data.js`（每个孩子的 t1、t2、t1d、t2d、change、group）
- 配色：改 `style.css` 顶部 `:root` 里的颜色
- 标题：改 `index.html` 里的 h1 和 sub

## 五、重要提醒
- 只放匿名数据，严禁把真实姓名、学校、住址、原始访谈记录上传到公开网络。
- 若答辩后不再需要公开展示，可把仓库设为 Private 或删除。
