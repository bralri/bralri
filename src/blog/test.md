---
title: Lorem ipsum dolor sit amet
type: "BlogPosting"
priority: "0.5"
date: 2023-04-01
tags: ['post']
description: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

gallery:
  - url: "/assets/img/1.png"
    title: "Lorem ipsum dolor sit amet"
    alt: "Lorem ipsum dolor sit amet"
---

<figure class="main-article__figure">
    <img src="{{ gallery[0].url  }}" alt="{{ gallery[0].alt }}" title="{{ gallery[0].title }}">
        <figcaption>
            "{{ gallery[0].title }}". {{ gallery[0].alt }}.
        </figcaption>
</figure><br>

<p>text here</p><br>