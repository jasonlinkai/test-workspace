# 前端專案建置雜談

## 為什麼我選擇擁抱 monorepo?
在前端開發中常常會遇到一個問題，假如有一個專案需要依賴其他專案，在依賴版本的管理中會變得非常繁雜。這種情形下使用lerna及yarn workspaces來實作這種依賴關係時會非常方便。

例如，我們有兩個共用組件: header1、header2，並有三個專案: storybook、app1、app2，且版本皆為1.0.0。然而依賴關係是這樣的：app1依賴header1，app2依賴header2, storybook依賴header1及header2，且這是目前專案中的最新進度。如下圖：
```sh
# git HEAD - 版本皆為1.0.0

header1-v1.0.0
header2-v1.0.0
storybook-v1.0.0
app1-v1.0.0
app2-v1.0.0
```

先假設一個情境，我們使用傳統的方式將所有的包分開來管理會發生什麼事呢？

當今天需求來了，header1進行修改，版本變為1.0.1，這時候通常我們需要將依賴header1的套件也升級版本。依照範例，則需到app1及storybook專案下，將package.json下dependencies欄位的header1版本進行提升(1.0.0 => 1.0.1)，並為自己也升級版本號為1.0.1。

> **注意**: 這一切都還仰賴於我們記得它們的依賴關係！

也許我們可以像範例中使用相對應的檔名，但這種管理方式基本上在數量變多或是交叉引用的情況下肯定會失控。

這種時候我們就可以借助lerna實作monorepo架構來幫我們記住依賴關係啦！當我們完成header1的git commit後，如下操作:
```sh
# 輸入下方指令
npx lerna changed

# 我是輸出
changed list:
  -header1
  -storybook
  -app1

# 很明顯地，lerna可以通過我們在package.json中互相引用的情況，來確認依賴關係。
```

也可以執行"npx lerna run build --since"，此時lerna則會幫我們執行每個受影響的package下的build script，
這也意味著我們不需要使用傳統的方法來檢查異動，例如監聽某個資料夾? 來確保誰需要執行重新跑cd動作。

更重要的是workspaces可以將所有專案下一致的node_module都hoist到共用的地方，
這也意味著我們不需要重複下載node_modules的資源了。

在現代化前端開發中，通常公司都會建立自己的共用組件庫，lerna當然也提供了檢查異動，自動打上version tag及publish到npm的功能。
相關指令:
```sh
# 替changed list中的包提升版本號(依照範例，此指令將自動替我們把app1及storybook中，header1的版本寫為1.0.1)。
npx lerna version

# 此指令則會將changed list中的包，使用新的版本號部署至npm上。
npx lerna publish
```

## 使用pre-commit及eslint和prettier來確保代碼一致性

### 添加推送前置腳本
我們可以使用husky建立git hooks中的pre-commit腳本，腳本的內容為調用lint-staged。

### 在前置腳本中檢查被git staged的檔案
lint-staged可以檢查被git staged的檔案，並針對檔案的尾綴來lint它們。

### 保證代碼的一致性
使用eslint及prettier確保提交到git上的代碼一致性。

