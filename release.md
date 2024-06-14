開始上線。
將預發分支併入main分支。
當main分支察覺到新的commit，開始建置預發環境。
```sh
# 運維可以通過這個指令獲取異動的組件或專案。
npx lerna changed --json > changed.json 
```
```sh
# 運維可以通過這個指令只重新test/build被異動的部分。
NODE_ENV=production npx lerna run test --since
NODE_ENV=production npx lerna run build --since
```
最後loop changed.json的資料進行dist的搬遷即可。

```sh
# 這指令會將異動到的部分建立新的版本號碼，互相依賴的部分也會一起提升版本，並建立TAG，這邊是自動走最小版本號碼 1.0.0 => 1.0.1。
npx lerna version --yes --conventional-commits
# 這個指令選用，它會自動將private=false的workspace依照配置部署至npm
npx lerna publish --yes --no-private
```