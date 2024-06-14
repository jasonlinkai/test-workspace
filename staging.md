準備上線前，我們需要在預發環境上測試。
將測試分支併入staging分支。
當staging分支察覺到新的commit，開始建置預發環境。
```sh
# 運維可以通過這個指令獲取異動的組件或專案。
npx lerna changed --json > changed.json 
```
```sh
# 運維可以通過這個指令只重新test/build被異動的部分。
NODE_ENV=staging npx lerna run test --since
NODE_ENV=staging npx lerna run build --since
```
最後loop changed.json的資料進行dist的搬遷即可。