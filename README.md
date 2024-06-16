# 前端專案建置雜談

## 架構選擇 monorepo or polyrepo?
先說結論，筆者傾向於將前端專案以monorepo的形式進行管理，因為以管理成本來說，monorepo相較於polyrepo，它成本是比較小的。

通常在一間公司內，經常會存在許多不同的前端專案，而專案間通常會有邏輯相同的部分，舉例來說：多個專案使用同一套api邏輯的情形。這種時候我們可以用較為抽象的代碼設計方式，並將這些JS邏輯抽成共用包，然後讓專案們同時依賴它。但在這種使用情境下，只要專案或是共用包的數量一多，依賴版本的管理通常會變得非常複雜，此時則可以通過使用monorepo來管理這種複雜依賴關係的情境。

當然monorepo也有它的缺點，例如：可能會暴露一些專案給不相關的人員、使git紀錄較為凌亂(因為通常只使用一個git紀錄來管理所有的內容)。但比起管理如此複雜的依賴關係，這些缺點的成本相對較小，且也更容易被處理好。

## 用範例來理解monorepo的版本管理優勢

例如，有兩個共用組件專案: header1、header2，並有三個應用程式專案: storybook、app1、app2，且版本皆為1.0.0。然而依賴關係是這樣的：app1依賴header1，app2依賴header2, storybook依賴header1及header2，且這是目前的最新進度。如下圖：
```sh
# git HEAD - 版本皆為1.0.0
header1-v1.0.0
header2-v1.0.0
storybook-v1.0.0
app1-v1.0.0
app2-v1.0.0
```

並假設一個情境：當今天需求來了，需要對header1專案進行修改，修改完後版本假設變為1.0.1，這時候通常也需要將依賴header1的專案也進行版本升級。

### polyrepo架構中的版本管理

依照上方文中所提及的情境，則需到app1及storybook專案下，將package.json下dependencies欄位的header1專案版本進行提升(1.0.0 => 1.0.1)，並為各自也升級版本號為1.0.1。

> **注意**: 這一切都還仰賴於人們能記得它們的依賴關係！

也許可以像範例中使用相對應的檔名，但這種版本管理方式基本上在數量變多或是交叉引用的情況下大概率會失控。

這種時候就可以借助lerna實作monorepo架構來幫忙記住依賴關係！

### monorepo架構中的版本管理
與上方相同的情境，當我們完成header1專案的需求，且建立git commit完成後，如下操作:

```sh
# 輸入下方指令
npx lerna changed

# 下方changed list為上方指令的輸出，很明顯地，lerna可以通過在專案下各自的package.json中互相引用的情況，來確認依賴關係。
changed list:
  -header1
  -storybook
  -app1
```

現在確認了lerna可以幫助我們記住這些依賴關係後，進一步地使用可以參考下方的指令:

```sh
# 替changed list中的專案提升版本號
# (依照情境，此指令將自動替我們把app1及storybook中，header1的版本寫為1.0.1，並將各自的版本也提升為1.0.1)。
npx lerna version patch

# 替changed list中的專案執行各自package.json中所定義的build指令。
npx lerna run build --since

# 替changed list中的專案使用新的版本號，並部署至npm上。
npx lerna publish
```

> **注意**: npx lerna run build --since 指令的這個"build"並不是特別被定義的lerna指令，而是依據workspaces中，每個專案下的package.json -> scripts 欄位所定義的指令，這邊的範例預設了所有在workspaces下的專案都使用"build"這個指令來執行打包腳本。

## 多人開發下如何確保代碼的一致性?

### 添加git pre-commit腳本
由於無法確保所有人能寫出一致性高的代碼，所以可以選擇使用git hook中的pre-commit鉤子，讓開發人員在推送前必須將內容經過lintor的檢查。首先，使用husky建立git hook中的pre-commit腳本，腳本的內容設定為調用lint-staged。

### 在pre-commit腳本中檢查被git staged的檔案
開發完成後，通常我們會需將對這次的檔案異動建立提交，但在建立提交前，我們需要將異動的部分變為staged狀態，才能開始進行提交動作。lint-staged則可以幫助我們檢查被git staged的檔案，並針對檔案的副檔名，讓這些檔案通過應該通過的lintor，並修改它們成為我們規範的樣子。通常通過配置例如：*eslint --fix*，即可將被lint後的差異也寫入檔案上，並被lint-staged改回staged狀態。然而，這也意味著我們可以使用這個功能，來對代碼進行提交前的一致性調整。

### 使用eslint及prettier來保證代碼的一致性
我們讓staged的檔案通過eslint及prettier來確保提交到git上的代碼一致性。

### 實作在monorepo中的情形
我們可以讓不同的專案擁有自己的lintor配置，因為lerna實際上只是執行了專案下package.json => scripts欄位中定義的lint指令。

## 在monorepo中，結合git flow的ci、cd流

> **注意**: 這邊提到的git flow不是正統的git flow。

假設有三個環境: testing staging production，並有各自的分支，而production對應的分支假設是main，且假設目前三個分支的內容是同步的，可以預想流程會如同下方。

### 範例流程
從main分支拉出前一版本的進度，並建立feature-a這個分支，並在feature-a分支上進行功能的開發。
開發完成，準備進入測試環境，可以直接將feature-a分支合併到testing分支，當testing分支察覺到新的commit，則開始建置測試環境的CI、CD。

```sh
# 這個指令只重新test/build被異動的部分，--since默認就是git HEAD的位置。
# 帶入測試環境env，讓代碼識別是被部署到測試環境中。
NODE_ENV=testing npx lerna run test --since
NODE_ENV=testing npx lerna run build --since

# 而運維同仁可以通過這個指令獲取異動的專案，並執行對應的CI、CD動作。
# 例如可以loop changed.json中的陣列資料，將打包完成的dist進行搬遷，或是執行docker建立映像、部署容器的動作。
npx lerna changed --json > changed.json 
```

然而staging及production的流程基本上也如同上方所述，改為對應的分支及環境變數即可。但在生產環境中，則可以多跑幾個指令：
```sh
# 這指令會將異動到的專案建立新的版本號，互相依賴的部分也會一起提升版本，並為monorepo建立新的git tag，版本升級情形為1.0.0 => 1.0.1，並依照提交自動建立changeLog。
npx lerna version patch --yes --conventional-commits
#  這指令會將異動到的專案建立新的npm包，自動將package.json中，private設定為false的專案依照配置部署至npm。
npx lerna publish --yes --no-private
```
