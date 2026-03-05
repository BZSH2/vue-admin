# Page snapshot

```yaml
- generic [active] [ref=e1]:
    - generic [ref=e4]:
        - generic [ref=e5]: System login
        - generic [ref=e6]:
            - generic [ref=e7]:
                - generic [ref=e8]: '*username'
                - textbox "*username" [ref=e12]:
                    - /placeholder: Please enter username
                    - text: admin
            - generic [ref=e13]:
                - generic [ref=e14]: '*password'
                - generic [ref=e17]:
                    - textbox "*password" [ref=e18]:
                        - /placeholder: Please enter password
                        - text: '123456'
                    - img [ref=e21] [cursor=pointer]
            - button "Log in" [ref=e26] [cursor=pointer]:
                - generic [ref=e27]: Log in
    - img
```
