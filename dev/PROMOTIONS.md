# Stage Promotion

When creating new infrastructure blocks (new function, new table, etc.), use the scripts available in the `package.json` in `website/` and `extension/` directories. To ensure that amplify metadata files are synced across extension and website branches, make sure to run `amplify pull --yes` after changing anything infra related in one branch.

Promoting infrastructure changes (from dev -> gamma or from gamma -> prod) is a tedious process that involves resolving git conflicts. For now use `promote.{env}.sh` scripts as a guideline for how to copy over infra changes to higher level stages.

Example promotion

```txt
1. amplify update api
2. Create chummyServer function
3. amplify update function (remove dependencies for chummyCheckoutTrigger)
4. amplify update api (remove chummyCheckoutTrigger path)
4. amplify remove function
5. Add below permissions to chummyServer function
6. Runtime to nodejs14
7. amplify push
8. git merge —squash
9. Resolve conflicts
10. amplify push
11. git push
```
