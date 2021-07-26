import setuptools

with open("README.md", "r") as fh:
    long_description = fh.read()

setuptools.setup(
    name="EasyDSA",
    version="0.0.1",
    author="Deep Awasthi",
    author_email="da.madskull@gmail.com",
    description="A Data Structures and Algorithms collection written in Pyhton which helps developers in implementing fast and efficient algorithms",
    long_description=long_description,
    long_description_content_type="text/markdown",
    url="https://github.com/mad-skull/EasyDSA.git",
    packages=setuptools.find_packages(),
    classifiers=[
        "Programming Language :: Python :: 3",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
    ],
    python_requires='>=3.5',
)