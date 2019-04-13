# denali

poll.json
```
{
	"item_name": {
		questions: "",
		choices: [
			{
				text: "",
				next_step: "" or null if terminal state,
				final_key: "POLICY_OR_RULE_KEY"
			},
			...
		],
		item_type: RADIO or CHECKBOX
	}
}
```

result.json
```
{
	"POLICY_OR_RULE_KEY": {
		"text": "",
		"sub_rules": [
			{
				"final_key": "POLICY_OR_RULE_KEY",
				"text": "",
				"is_complete": BOOLEAN,
			},
			...
		],
}
```

For polling,
- have a stack and a result list
- push "start" first to stack
- while stack is not empty,
    - pop from stack
    - render the component
    - every time an option is submitted,
        - if next_step is not null, push to stack
        - if final_key is not null, push to result list
- no cycles allowed, should be a tree for now


For results,
- take all keys from result list and render top level text from results.json
- for each eligible key,
    - take all sub_rules and check if their final keys match
    - if so, render the item with the is_complete status
- ANY(sub_rules.is_complete == false) -> mark parent as incomplete
