---
layout: 'work-post-alt.njk'
title: "Transient Residency"
type: "BlogPosting"
priority: "0.5"
date: 2022-07-04
year: "2022"
tags: ["work"]
description: "Transient Residency is an Online Residency Programme via Instagram, supporting creatives who explore the relationship between Art & Technology."

video:
  - url: "/assets/video/works/transient-residency/1.m4v"
    name: "Metamorphosis"
    description: "Video of a rotating 3D model"
    thumbnail: "/assets/img/works/in-utopia/in-utopia.png"
    uploadDate: "2022-07-04"
    duration: "PT0M20S"
  - url: "/assets/video/works/transient-residency/2.m4v"
    name: "Metamorphosis"
    description: "Video of a rotating 3D model"
    thumbnail: "/assets/img/works/in-utopia/in-utopia.png"
    uploadDate: "2022-07-04"
    duration: "PT0M20S"
  - url: "/assets/video/works/transient-residency/3.m4v"
    name: "Metamorphosis"
    description: "Video of a rotating 3D model"
    thumbnail: "/assets/img/works/in-utopia/in-utopia.png"
    uploadDate: "2022-07-04"
    duration: "PT0M20S"
  - url: "/assets/video/works/transient-residency/4.m4v"
    name: "Metamorphosis"
    description: "Video of a rotating 3D model"
    thumbnail: "/assets/img/works/in-utopia/in-utopia.png"
    uploadDate: "2022-07-04"
    duration: "PT0M20S"
  - url: "/assets/video/works/transient-residency/5.m4v"
    name: "Metamorphosis"
    description: "Video of a rotating 3D model"
    thumbnail: "/assets/img/works/in-utopia/in-utopia.png"
    uploadDate: "2022-07-04"
    duration: "PT0M20S"
  - url: "/assets/video/works/transient-residency/6.m4v"
    name: "Metamorphosis"
    description: "Video of a rotating 3D model"
    thumbnail: "/assets/img/works/in-utopia/in-utopia.png"
    uploadDate: "2022-07-04"
    duration: "PT0M20S"
  - url: "/assets/video/works/transient-residency/7.m4v"
    name: "Metamorphosis"
    description: "Video of a rotating 3D model"
    thumbnail: "/assets/img/works/in-utopia/in-utopia.png"
    uploadDate: "2022-07-04"
    duration: "PT0M20S"
  - url: "/assets/video/works/transient-residency/8.m4v"
    name: "Metamorphosis"
    description: "Video of a rotating 3D model"
    thumbnail: "/assets/img/works/in-utopia/in-utopia.png"
    uploadDate: "2022-07-04"
    duration: "PT0M20S"
  - url: "/assets/video/works/transient-residency/9.m4v"
    name: "Metamorphosis"
    description: "Video of a rotating 3D model"
    thumbnail: "/assets/img/works/in-utopia/in-utopia.png"
    uploadDate: "2022-07-04"
    duration: "PT0M20S"

gallery:
  - url: "/assets/img/works/transient-residency/transient-residency.png"
    title: "Metamorphosis.1.2.2"
    alt: "3D model with a pixelated surface."
---

<figure class="main-article__figure">
    <img src="{{ gallery[0].url  }}" alt="{{ gallery[0].alt }}" title="{{ gallery[0].title }}">
        <figcaption>
            "{{ gallery[0].title }}". {{ gallery[0].alt }}.
        </figcaption>
</figure>

<br>

<p>{{ description }} During this residency I shared works from a recent work in progress project called <i>Metamorphosis</i>. Metamorphosis being the transformation, change and growth of something, this project is interested in those concepts of change specific to the human condition.</p>

<p>Exploring ideas such as posthumanism and transhumanism, bodily augmentation, cybernetics and biomechanics. This project explores those ideas through the lens of science-fiction and fantasy. How these ideas present themselves in fiction and how they depict the enhancement of humanity, for example like the enxtention and longevity of human life or technological advancements which can aid and improve on the body.</p>

<p><i>Metamorphosis</i> also reflects on my relationship with my own body and the concerns I have with hereditary conditions and the fragilities that come with growing older. With fantastical post-humanism in mind, I imagined these potential machine, these vessel-like chrysalis whose potential and purpose has not yet been fully realised. They could be for traversing space, or interdimensional cryostasis pods, or multi-purpose bespoke chambers to heal all ailments. Or even personal personal bunker armours to out live a potential armageddon</p>

<br>

<p>🌌 Transient Residency <a href="https://www.transienttt.co.uk/about" target="_blank" rel="noopener">Website</a>.</p>
<p>🔗 Transient Residency <a href="https://www.instagram.com/t.ransienttt/" target="_blank" rel="noopener">Instagram</a>.</p>

<br>
<br>

<div class="videos-grid">
{% for media in video %}
<div class="video">
    <video width="100%" height="100%" controls="controls" controlsList="nodownload" title="{{ media.name }}" alt="{{ media.description }}">
        <source src="{{ media.url }}" type="video/mp4">
            Your browser does not support the video tag.
    </video>
</div>
{% endfor %}
</div>