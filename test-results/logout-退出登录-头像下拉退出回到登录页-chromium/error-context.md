# Page snapshot

```yaml
- generic [ref=e1]:
    - generic [ref=e4]:
        - generic [ref=e5]: System login
        - generic [ref=e6]:
            - generic [ref=e7]:
                - generic [ref=e8]: '*username'
                - generic [ref=e11]:
                    - textbox "*username" [active] [ref=e12]:
                        - /placeholder: Please enter username
                        - text: admin
                    - img [ref=e15] [cursor=pointer]
            - generic [ref=e18]:
                - generic [ref=e19]: '*password'
                - generic [ref=e22]:
                    - textbox "*password" [ref=e23]:
                        - /placeholder: Please enter password
                        - text: '123456'
                    - img [ref=e26] [cursor=pointer]
            - button "Log in" [ref=e31] [cursor=pointer]:
                - generic [ref=e32]: Log in
    - img
```
