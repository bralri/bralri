---
title: "first blog post"
type: "BlogPosting"
priority: "0.5"
date: 2023-04-11
year: "2023"
tags: ["post"]
description: "first blog post"

# video:
#   - url: ""
#     name: ""
#     description: ""
#     thumbnail: ""
#     uploadDate: ""
#     duration: "PT M S"

gallery:
  - url: "/assets/img/1.png"
    title: ""
    alt: ""
---

<figure class="main-article__figure">
    <img src="{{ gallery[0].url  }}" alt="{{ gallery[0].alt }}" title="{{ gallery[0].title }}">
        <figcaption>
            "{{ gallery[0].title }}". {{ gallery[0].alt }}.
        </figcaption>
</figure>

<br>

<!-- <video width="100%" height="100%" controls controlsList="nodownload">
    <source src="{{ video[0].url }}" type="video/mp4">
    Your browser does not support the video tag.
</video>
<figcaption>
    "{{ video[0].name }}". {{ video[0].description }}.
</figcaption>

<br> -->

<p>text</p>

<br>
<br>