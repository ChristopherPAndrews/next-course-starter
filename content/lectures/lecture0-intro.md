---
title: 'Lecture 0 - Introduction'
name: 'Lecture 0 - Intro'
date: '2020-09-08'
published: true
---

# Introduction

Some content goes here

Lift($L$) can be determined by Lift Coefficient ($C_L$) like the following
equation.

$$
L = \frac{1}{2} \rho v^2 S C_L
$$

I'm changing the thing... and it is not really watching

<hidden message="Click to see">

_Boo_

</hidden>

<details>
<summary>View the code</summary>

```javascript
import Link from 'next/link';

function Home() {
  return (
    <ul>
      <li>
        <Link href="/">
          <a>Home</a>
        </Link>
      </li>
      <li>
        <Link href="/about">
          <a>About Us</a>
        </Link>
      </li>
      <li>
        <Link href="/blog/hello-world">
          <a>Blog Post</a>
        </Link>
      </li>
    </ul>
  );
}

export default Home;
```

</details>
