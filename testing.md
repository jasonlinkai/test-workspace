從main分支拉出前一版本的進度，並建立feature-a這個分支。
並在feature-a分支上進行功能的開發。
開發完成，想進入測試環境，可以直接合併到testing分支。
當testing分支察覺到新的commit，開始建置測試環境。
```sh
# 運維可以通過這個指令獲取異動的組件或專案。
npx lerna changed --json > changed.json 
```
```sh
# 運維可以通過這個指令只重新test/build被異動的部分。
NODE_ENV=testing npx lerna run test --since
NODE_ENV=testing npx lerna run build --since
```
最後loop changed.json的資料進行dist的搬遷即可。

